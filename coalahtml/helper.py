import os
import shutil

from coala_utils.decorators import enforce_signature
from coalib.parsing.DefaultArgParser import default_arg_parser
from coalahtml import Constants
from coalahtml.tree import Tree


@enforce_signature
def get_file(file_name: str, dir_path: str=os.path.dirname(__file__)):
    return os.path.abspath(os.path.join(dir_path, file_name))


def parse_file_dict(file_dict):
    '''
    Return a dictionary with file as keys and content as values.
    '''
    result = {}
    for section in file_dict:
        result.update(file_dict[section])
    return result


def build_file_graph(file_dict, dir_path):
    """
    Build a hierarchical graph with a given file paths and
    store the root path in 'data/Constants.json' file.
    :param file_dict:
        File dictionary returned by coala.
    :param dir_path:
        Directory that stores the generated webpage code.
    """
    tr = Tree(parse_file_dict(file_dict).keys())
    home_file = get_file(Constants.CONFIGS['home'], dir_path)
    with open(home_file, 'w') as hm:
        hm.write(tr.root.name)

    return tr.extract()


def create_dir(path: str):
    '''
    Create a directory with the given path

    param path:
        directory path
    return:
        directory path or None id mkdir fails
    '''
    if not os.path.exists(path):
        os.mkdir(path, mode=0o775)

    return os.path.abspath(path)


def copy_files(src, dst):
    '''
    Copy files from source to destination

    param src:
        source path
    param dst:
        destination path
    '''
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        try:
            if os.path.isdir(s):
                shutil.copytree(s, d)
            else:
                shutil.copy2(s, d)
        except FileExistsError:  # pragma: no cover
            pass


def get_args():
    arg_parser = default_arg_parser()
    arg_parser.add_argument('--noupdate',
                            nargs='?',
                            const=True,
                            metavar='BOOL',
                            default=False,
                            help='Launch webserver from existing results.')
    arg_parser.add_argument('--dir',
                            nargs='?',
                            metavar='FILE',
                            default=os.path.abspath('./coalahtmlapp'),
                            help='Absolute path for storing webpages in '
                            'directory.')
    arg_parser.add_argument('--nolaunch',
                            nargs='?',
                            const=True,
                            metavar='BOOL',
                            default=False,
                            help='Do not launch webserver.')
    return arg_parser
