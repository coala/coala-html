import os
import re
import shutil
import sys
import unittest

from coalahtml import Constants
from coalahtml.helper import get_file
from coalahtml import coala_html
from coalib.misc.ContextManagers import prepare_file
from TestUtilities import execute_coala

ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                    "coalahtml", Constants.COALA_HTML_BASE)


class coalaHTMLTest(unittest.TestCase):

    def setUp(self):
        self.old_argv = sys.argv
        self.result_file = get_file(Constants.CONFIGS['results_file'], ROOT)

    def tearDown(self):
        sys.argv = self.old_argv

    def test_output_file(self):
        update_file = ""
        noupdate_file = ""
        with prepare_file(["#todo this is todo"], None) as (lines, filename):
            execute_coala(coala_html.main,
                          "coala-html",
                          "-c", os.devnull,
                          "-b", "LineCountBear",
                          "-f", re.escape(filename),
                          "--nolaunch")
            with open(self.result_file, 'r') as fp:
                update_file = fp.read()

            execute_coala(coala_html.main,
                          "coala-html",
                          "-c", os.devnull,
                          "-b", "LineCountBear",
                          "-f", re.escape(filename),
                          "--noupdate",
                          "--nolaunch")

            with open(self.result_file, 'r') as fp:
                noupdate_file = fp.read()

        self.assertEqual(update_file, noupdate_file)
        shutil.rmtree('coalahtmlapp', ignore_errors=True)
