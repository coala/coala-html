from collections import OrderedDict
from queue import Queue
import os


class Node:

    def __init__(self, name, parent=None, abspath=""):
        self.child = {}
        self.parent = parent
        self.name = name
        self.abspath = abspath


class Tree:

    def __init__(self, file_list):
        """
        Create a root and build the graph.
        """
        rootname = Tree.findroot(file_list)
        self.root = Node(rootname, abspath=rootname)
        self.fl_split = [path.split(os.sep) for path in file_list]
        self._build(self.fl_split)

    @staticmethod
    def findroot(file_list):
        prefix = os.path.commonprefix(list(file_list))
        last_sep = prefix.rfind(os.sep)
        return prefix[:last_sep]

    def _build(self, fl_split):
        start = len(self.root.name.split(os.sep))
        for each_path in fl_split:
            prev_node = self.root
            for item in each_path[start:]:
                new_node = Node(item,
                                parent=prev_node,
                                abspath=os.path.join(prev_node.abspath, item))
                if not prev_node.child.get(new_node.name, None):
                    prev_node.child[new_node.name] = new_node
                prev_node = prev_node.child[new_node.name]

    def extract(self):
        """
        Create a dictionary with directory as key and value
        is a list of directory's contents. If a tree has root
        node only then it will return a dictionary with root name
        as key and empty list as its value.
        """
        result = OrderedDict()
        q = Queue()
        q.put(self.root)
        result[self.root.abspath] = []
        while not q.empty():
            current = q.get()
            if os.path.isdir(current.abspath):
                result[current.abspath] = []
            for child in current.child.values():
                q.put(child)
                result[current.abspath].append(child.abspath)

        return result
