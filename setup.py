#!/usr/bin/env python3

import locale
import sys
from os import getenv
from subprocess import call

# Start ignoring PyImportSortBear as imports below may yield syntax errors
from coalib import assert_supported_version

assert_supported_version()
# Stop ignoring

import setuptools.command.build_py
from coalib.misc import Constants
from coalib.misc.BuildManPage import BuildManPage
from coalib.output.dbus.BuildDbusService import BuildDbusService
from setuptools import find_packages, setup
from setuptools.command.test import test as TestCommand

try:
    locale.getlocale()
except (ValueError, UnicodeError):
    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')


class PyTestCommand(TestCommand):

    def run_tests(self):
        # import here, cause outside the eggs aren't loaded
        import pytest
        errno = pytest.main([])
        sys.exit(errno)


# Generate API documentation only if we are running on readthedocs.org
on_rtd = getenv('READTHEDOCS', None) != None
if on_rtd:
    call(BuildDocsCommand.apidoc_command)

with open('requirements.txt') as requirements:
    required = requirements.read().splitlines()

with open('test-requirements.txt') as requirements:
    test_required = requirements.read().splitlines()

with open("README.rst") as readme:
    long_description = readme.read()


if __name__ == "__main__":
    
    setup(name='coala-html',
          version=Constants.VERSION,
          description='Generate a Webpage using results from coala',
          author="The coala developers",
          maintainer="Lasse Schuirmann, Fabian Neuschmidt, Mischa Kr\xfcger"
                      if not on_rtd else "L.S., F.N., M.K.",
          maintainer_email=('lasse.schuirmann@gmail.com, '
                            'fabian@neuschmidt.de, '
                            'makman@alice.de'),
          url='http://coala-analyzer.org/',
          platforms='any',
          packages=find_packages(exclude=["build.*", "tests", "tests.*"]),
          install_requires=required,
          tests_require=test_required,
          package_data={'coalahtml': ['_coalahtml/*.*',
                                   '_coalahtml/app/controllers/*.*',
                                   '_coalahtml/app/styles/*.*',
                                   '_coalahtml/app/views/*.*',
                                   '_coalahtml/app/*.*',
                                   '_coalahtml/tests/test_projects/simple/*.*',
                                   '_coalahtml/tests/test_projects/simple/test_'
                                   'dir/*.*']},
          license="AGPL-3.0",
          long_description=long_description,
          entry_points={
              "console_scripts": [
                  "coala-html = coalahtml.coala_html:main"]},
          # from http://pypi.python.org/pypi?%3Aaction=list_classifiers
          classifiers=[
              'Development Status :: 4 - Beta',

              'Environment :: Console',
              'Environment :: MacOS X',
              'Environment :: Win32 (MS Windows)',
              'Environment :: X11 Applications :: Gnome',

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
