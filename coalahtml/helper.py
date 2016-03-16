import os
import shutil
import socket

from coalib.parsing.DefaultArgParser import default_arg_parser


COALA_HTML_BASE = '_coalahtml'
COALA_HTML_DATA = os.path.join('tests', 'test_projects', 'simple')
CONFIGS = {
        "results_file": os.path.join(COALA_HTML_DATA, 'coala.json'),
        "file_data": os.path.join(COALA_HTML_DATA, 'file_data.json'),
        "files": os.path.join(COALA_HTML_DATA, 'files.json')}
LOCALHOST = socket.gethostbyname(socket.gethostname())
PORT = 8000
URL = "http://" + LOCALHOST + ":" + str(PORT)

def get_file(file_name: str, dir_path: str=os.path.dirname(__file__)):
    r = os.path.abspath(os.path.join(dir_path, file_name))
    return r

def create_dir(path: str):
    '''
    Create a directory with the given path

    param path: directory path
    return: directory path or None id mkdir fails
    '''
    if not os.path.exists(path):
        try:
            os.mkdir(path, mode = 0o775)
        except Exception as e:
            print(e)
    return os.path.abspath(path)

def copy_files(src, dst):
    '''
    Copy files from source to destination

    param src: source path
    param dst: destination path
    '''
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        try:
            if os.path.isdir(s):
                shutil.copytree(s, d)
            else:
                shutil.copy2(s, d)
        except Exception as e:
            print(e)

def get_args():
    arg_parser = default_arg_parser()
    arg_parser.add_argument('-N',
                            '--noupdate',
                            nargs='?',
                            const=True,
                            metavar='BOOL',
                            default=False,
                            help='Launch webpage from existing results.')
    arg_parser.add_argument('--dir',
                            nargs='?',
                            metavar='FILE',
                            default=os.path.expanduser('~/_coalahtml'),
                            help='Absolute path for storing webpages in '
                            'directory.')
    arg_parser.add_argument('--nolaunch',
                            nargs='?',
                            const=True,
                            metavar='BOOL',
                            default=False,
                            help='Launch webpage')
    return arg_parser
