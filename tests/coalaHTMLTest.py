import json
import os
import re
import sys
import unittest

from coalahtml.helper import CONFIGS, COALA_HTML_BASE, get_file
from coalahtml import coala_html
from coalib.misc.ContextManagers import prepare_file
from TestUtilities import execute_coala

ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                    "coalahtml", COALA_HTML_BASE)


class coalaHTMLTest(unittest.TestCase):

    def setUp(self):
        self.old_argv = sys.argv
        self.result_file = get_file(CONFIGS['results_file'], ROOT)

    def tearDown(self):
        sys.argv = self.old_argv

    def test_output_file(self):
        print("DUDE")
        update_file = ""
        noupdate_file = ""
        with prepare_file(["#todo this is todo"], None) as (lines, filename):
            execute_coala(coala_html.main,
                          "coala-html",
                          "-c", os.devnull,
                          "-b", "LineCountBear",
                          "-f", re.escape(filename),
                          "--nolaunch")
            with open(self.result_file) as fp:
                update_file = json.load(fp)
            execute_coala(coala_html.main,
                          "coala-html",
                          "-c", os.devnull,
                          "-b", "LineCountBear",
                          "-f", re.escape(filename),
                          "-N",
                          "--nolaunch")
            with open(self.result_file) as fp:
                noupdate_file = json.load(fp)

        self.assertEqual(update_file['results']['default'][0]['message'],
                         noupdate_file['results']['default'][0]['message'])
