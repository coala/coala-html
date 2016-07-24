import os
import re
import shutil
import socketserver
import sys
import unittest
from unittest.mock import patch

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
        """
        Before launching the server, we `chdir` to angular app i.e
        `coalahtmlapp` in coala_html.main. So we need to reset this so
        that other tests can run fine.
        """
        os.chdir(os.path.dirname(os.path.dirname(__file__)))
        shutil.rmtree('coalahtmlapp', ignore_errors=True)

    @patch.object(socketserver.TCPServer, 'serve_forever', autospec=True)
    @patch.object(socketserver.TCPServer, 'server_close', autospec=True)
    @patch('coalahtml.coala_html.call')
    @patch('webbrowser.open')
    def test_noupdate(self, mock_browser,
                      mock_subprocess_call,
                      mock_server_close,
                      mock_serve_forever):
        """
        Test that when JSON configs are already generated, coala-html
        with 'noupdate' option will run successfully and not update existing
        configuration. Also, we mock the expensive http calls and instantiating
        the server by mocking the corresponding method calls.
        """
        mock_serve_forever.side_effect = KeyboardInterrupt
        mock_subprocess_call.return_value = 0  # To mock the `bower install`
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
                          "--noupdate")

            with open(self.result_file, 'r') as fp:
                noupdate_file = fp.read()

        self.assertEqual(update_file, noupdate_file)
        self.assertTrue(mock_browser.called)
        self.assertTrue(mock_serve_forever.called)
        self.assertTrue(mock_server_close.called)
