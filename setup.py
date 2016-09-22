#!/usr/bin/env python3

from os import getenv
import sys
from setuptools import find_packages, setup
from setuptools.command.test import test as TestCommand


class PyTestCommand(TestCommand):

    def run_tests(self):
        # import here, cause outside the eggs aren't loaded
        import pytest
        errno = pytest.main([])
        sys.exit(errno)

on_rtd = getenv('READTHEDOCS', None) != None

with open('requirements.txt') as requirements:
    required = requirements.read().splitlines()

with open('test-requirements.txt') as requirements:
    test_required = requirements.read().splitlines()

with open("README.rst") as readme:
    long_description = readme.read()

with open('VERSION', 'r') as v:
    VERSION = v.read().strip()


if __name__ == "__main__":

    setup(name='coala-html',
          version=VERSION,
          description='Generate a Webpage using results from coala',
          author="The coala developers",
          maintainer="Tushar Gautam"
                      if not on_rtd else "L.S., F.N., M.K.",
          maintainer_email=('tushar.rishav@gmail.com'),
          url='http://coala.io/',
          platforms='any',
          packages=find_packages(exclude=["build.*", "tests", "tests.*"]),
          install_requires=required,
          tests_require=test_required,
          package_data={'coalahtml': ['_coalahtml/*.*',
                                      '_coalahtml/app/controllers/*.*',
                                      '_coalahtml/app/styles/*.*',
                                      '_coalahtml/app/views/*.*',
                                      '_coalahtml/app/*.*',
                                      '_coalahtml/data/*.*']},
          license="AGPL-3.0",
          long_description=long_description,
          entry_points={
              "console_scripts": [
                  "coala-html = coalahtml.coala_html:main"]},
          classifiers=[
              'Development Status :: 4 - Beta',

              'Environment :: Console',

              'Intended Audience :: Science/Research',
              'Intended Audience :: Developers',

              'License :: OSI Approved :: GNU Affero General Public License '
              'v3 or later (AGPLv3+)',

              'Operating System :: OS Independent',

              'Programming Language :: Python :: Implementation :: CPython',
              'Programming Language :: Python :: 3.3',
              'Programming Language :: Python :: 3.4',
              'Programming Language :: Python :: 3.5',
              'Programming Language :: Python :: 3 :: Only',

              'Topic :: Scientific/Engineering :: Information Analysis',
              'Topic :: Software Development :: Quality Assurance',
              'Topic :: Text Processing :: Linguistic'],
          cmdclass={'test': PyTestCommand})
