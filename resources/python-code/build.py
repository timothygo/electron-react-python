from distutils.dir_util import copy_tree
import PyInstaller.__main__
import os

# builds application using pyinstaller
PyInstaller.__main__.run([
    #'--noconsole',
    '--onefile',
    '-n=python',
    f'--distpath={os.path.join("..")}',
    os.path.join("src", "app.py")
])

# copies resources to output directory 
copy_tree("resources/", "../resources/")
