# -*- coding: utf-8 -*-
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Affero General Public License as published by the
# Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License
# for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import http.server
import itertools
import json
import os
import socketserver
from subprocess import call
import sys
import webbrowser

from coalahtml.helper import (
    get_file, create_dir, copy_files,
    get_args, build_file_graph, parse_file_dict)
from coalahtml import Constants
from coalib.coala_main import run_coala
from coalib.output.JSONEncoder import create_json_encoder
from coalib.output.printers.ListLogPrinter import ListLogPrinter


def gen_file_set(dirpath):
    """
    Parse an output from `os.walk` and create a set of its contents.
    :param dirpath:
        Source directory.
    :return:
        A set of directory contents traversed recursively.
    """
    content_set = set()
    for root, dir_list, file_list in os.walk(dirpath):
        content_set.add(root)
        for file_name in itertools.chain(dir_list, file_list):
            content_set.add(file_name)

    return content_set


def main():
    arg_parser = get_args()
    args = arg_parser.parse_args()

    dir_path = create_dir(os.path.abspath(args.dir))

    main_package = gen_file_set(get_file(Constants.COALA_HTML_BASE))
    local_package = gen_file_set(dir_path)

    if not main_package.issubset(local_package):  # pragma: no cover
        copy_files(get_file(Constants.COALA_HTML_BASE), dir_path)

    if not args.noupdate:
        log_printer = ListLogPrinter()
        results, exitcode, file_dict = run_coala(
            log_printer=log_printer, arg_parser=arg_parser)

        result_data = {"results": results}
        result_data["logs"] = log_printer.logs
        JSONEncoder = create_json_encoder(use_relpath=False)

        result_file = get_file(Constants.CONFIGS['results_file'], dir_path)
        file_data = get_file(Constants.CONFIGS['file_data'], dir_path)
        file_tree_data = get_file(Constants.CONFIGS['files'], dir_path)

        with open(file_tree_data, 'w') as fp:
            file_graph = build_file_graph(file_dict, dir_path)
            json.dump(file_graph, fp,
                      cls=JSONEncoder,
                      sort_keys=True,
                      indent=2,
                      separators=(',', ': '))

        with open(result_file, 'w') as fp:
            json.dump(result_data, fp,
                      cls=JSONEncoder,
                      sort_keys=True,
                      indent=2,
                      separators=(',', ': '))
        with open(file_data, 'w') as fp:
            json.dump(parse_file_dict(file_dict), fp,
                      cls=JSONEncoder,
                      sort_keys=True,
                      indent=2,
                      separators=(',', ': '))
    if not args.nolaunch:
        # Launch server with reference point dir_path
        os.chdir(dir_path)
        if not os.path.exists('bower_components'):
            res = call(['bower', 'install'])
            if res != 0:  # pragma: no cover
                print("Bower is required. Install from `http://bower.io/`")
                sys.exit(1)

        Handler = http.server.SimpleHTTPRequestHandler
        socketserver.TCPServer.allow_reuse_address = True
        httpd = socketserver.TCPServer(("", Constants.PORT), Handler)
        print("serving at ", Constants.URL)
        print("Press Ctrl+C to end the coala-html session")
        webbrowser.open(Constants.URL, new=2)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            httpd.server_close()
