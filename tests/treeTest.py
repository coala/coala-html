import unittest

from coalahtml.tree import Node, Tree
from coalib.coala_main import run_coala
from coalib.output.printers.ListLogPrinter import ListLogPrinter
from coalahtml.helper import parse_file_dict


class TreeTest(unittest.TestCase):

    def setUp(self):
        log_printer = ListLogPrinter()
        file_dict = run_coala(log_printer=log_printer,
                              autoapply=False)[2]
        self.FL = list(parse_file_dict(file_dict).keys())

    def test_node(self):
        node = Node(self.FL[0])
        self.assertEqual(node.name, self.FL[0])

    def test_extract(self):
        tr = Tree(self.FL)
        result = tr.extract()
        self.assertIn(tr.root.abspath, result.keys())

    def test_graph(self):
        tr = Tree(self.FL)
        testChild = tr.root.child['tests'].child.get('specs', None)
        self.assertTrue(testChild)
