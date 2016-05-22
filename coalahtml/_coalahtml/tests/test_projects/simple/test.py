import sys
entry_point = sys.argv[1]
print sys.argv
for entry in ['coala-json']:
    if entry_point.endswith(entry):
        parser_type = entry
        break
else:
    parser_type = 'coala'
# print
# todo
# fixme
