import os
import unittest

from coalahtml.tree import Node, Tree


class TreeTest(unittest.TestCase):

    def setUp(self):
        self.FL = []
        for root, _, file_list in os.walk(os.path.abspath('tests')):
            self.FL.extend(os.path.join(root, fname) for fname in file_list)

    def test_node(self):
        node = Node(self.FL[0])
        self.assertEqual(node.name, self.FL[0])

    def test_extract(self):
        tr = Tree(self.FL)
        result = tr.extract()
        self.assertIn(tr.root.abspath, result.keys())

    def test_graph(self):
        tr = Tree(self.FL)
        testChild = tr.root.child.keys()
        self.assertCountEqual(testChild, os.listdir('tests'))
