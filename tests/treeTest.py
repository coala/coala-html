import os
import unittest
from coalahtml.tree import Node, Tree


class TreeTest(unittest.TestCase):

    def setUp(self):
        self.FL = []
        for root, _, file_list in os.walk(os.path.abspath('tests')):
            for fname in file_list:
                self.FL.append(os.path.join(root, fname))

    def test_node(self):
        node = Node(self.FL[0])
        self.assertEqual(node.name, self.FL[0])

    def test_extract(self):
        tr = Tree(self.FL)
        result = tr.extract()
        self.assertIn(tr.root.abspath, result.keys())

    def test_graph(self):
        tr = Tree(self.FL)
        # use `set` to ignore the  order in comparison.
        testChild = set(tr.root.child.keys())
        self.assertEqual(testChild, set(os.listdir('tests')))
