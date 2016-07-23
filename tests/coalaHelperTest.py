import json
import os
import shutil
import sys
import unittest

from coalahtml.helper import (get_file, parse_file_dict, build_file_graph,
                              create_dir, copy_files, get_args)


class coalaHelperTest(unittest.TestCase):

    def setUp(self):
        self.old_argv = sys.argv
        sys.argv = ['coala']  # mock the entry point
        self.dir_name = "someRandomName"
        self.test_dir_path = os.path.abspath(self.dir_name)
        self.file_name = self.dir_name[::2]
        test_section = 'default'
        test_file_name = 'tempTest.py'
        test_file_content = 'import this\n'
        self.test_file_dict = {test_section: {
            test_file_name: (test_file_content)}}
        self.test_file_data = {test_file_name: test_file_content}

    def tearDown(self):
        sys.argv = self.old_argv

    def test_get_file(self):
        test_file_path = os.path.abspath(os.path.join(self.test_dir_path,
                                                      self.file_name))
        return_file_path = get_file(self.file_name, self.test_dir_path)
        self.assertEqual(test_file_path, return_file_path)

    def test_parse_file_dict(self):
        result_file_data = parse_file_dict(self.test_file_dict)
        self.assertEqual(result_file_data, self.test_file_data)

    def test_create_dir(self):
        self.assertEqual(create_dir(self.test_dir_path),
                         self.test_dir_path)
        os.rmdir(self.test_dir_path)

    def test_copy_files(self):
        s_dir = create_dir(os.path.abspath('S99'))
        d_dir = create_dir(os.path.abspath('D99'))
        s_test_file = os.path.join(s_dir, 'test.json')
        d_test_file = os.path.join(d_dir, 'test.json')

        with open(s_test_file, 'w') as sfp:
            json.dump({'key': 'value'}, sfp, separators=(',', ': '))

        copy_files(s_dir, d_dir)
        self.assertTrue(os.path.exists(d_test_file))
        shutil.rmtree(s_dir)
        shutil.rmtree(d_dir)

    def test_get_args(self):
        arg = get_args().parse_args()
        self.assertFalse(arg.noupdate)
        self.assertFalse(arg.nolaunch)
        self.assertEqual(arg.dir, os.path.abspath('./coalahtmlapp'))
