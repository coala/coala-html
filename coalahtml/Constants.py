import os


COALA_HTML_BASE = '_coalahtml'
COALA_HTML_DATA = 'data'
CONFIGS = {
        "results_file": os.path.join(COALA_HTML_DATA, 'coala.json'),
        "file_data": os.path.join(COALA_HTML_DATA, 'file_data.json'),
        "files": os.path.join(COALA_HTML_DATA, 'files.json'),
        "home": os.path.join(COALA_HTML_DATA, 'roothome')}
LOCALHOST = "0.0.0.0"
PORT = 8000
URL = "http://" + LOCALHOST + ":" + str(PORT)
