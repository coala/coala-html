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
import json
import os
import socketserver
import webbrowser

from coalahtml.helper import (
    COALA_HTML_BASE, PORT, CONFIGS, URL,
    get_file, create_dir, copy_files, get_args)
from coalib.coala_main import run_coala
from coalib.output.JSONEncoder import create_json_encoder
from coalib.output.printers.ListLogPrinter import ListLogPrinter



def main():
    arg_parser = get_args()
    args = arg_parser.parse_args()
    dir_path = create_dir(os.path.abspath(args.dir))
    # Copy iff target is empty
    if len(list(os.walk(dir_path))):
        copy_files(get_file(COALA_HTML_BASE),dir_path)
    if args.noupdate is False:
        log_printer = ListLogPrinter()
        results, exitcode, file_dict = run_coala(
            log_printer=log_printer, autoapply=False)
        retval = {"results": results}
        retval["logs"] = log_printer.logs
        JSONEncoder = create_json_encoder(use_relpath=False)
        result_file = get_file(CONFIGS['results_file'], dir_path)
        file_data = get_file(CONFIGS['file_data'], dir_path)
        with open(result_file, 'w+') as fp:
            json.dump(retval, fp,
                      cls=JSONEncoder,
                      sort_keys=True,
                      indent=2,
                      separators=(',', ': '))
        with open(file_data, 'w+') as fp:
            json.dump(file_dict, fp,
                      cls=JSONEncoder,
                      sort_keys=True,
                      indent=2,
                      separators=(',', ': '))
    if args.nolaunch is False:
        # Launch server with reference point dir_path
        os.chdir(dir_path)
        Handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", PORT), Handler)
        print("serving at ", URL)
        print("Press Ctrl+C to end the coala-html session")
        try:
            httpd.serve_forever()
            webbrowser.open(URL, new=2)
        except Exception as e:
            print(e)
