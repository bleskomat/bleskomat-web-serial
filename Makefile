## Usage
#
#   $ make all        # compile files that need compiling
#   $ make clean all  # remove target files and compile from scratch
#

## Variables
BIN=./node_modules/.bin
DIST=./dist
DIST_INDEX_JS=$(DIST)/index.js
DIST_INDEX_MIN_JS=$(DIST)/index.min.js
PUBLIC=./public
TEST=./test

# Targets
#
# The format goes:
#
#   target: list of dependencies
#     commands to build target
#
# If something isn't re-compiling double-check the changed file is in the
# target's dependencies list.

# Phony targets - these are for when the target-side of a definition
# (such as "all" below) isn't a file but instead a just label. Declaring
# it as phony ensures that it always run, even if a file by the same name
# exists.
.PHONY: all\
clean\
test

all: $(DIST_INDEX_JS) \
$(DIST_INDEX_MIN_JS)

clean:
	# Delete build process output files:
	rm -rf $(DIST)

EXPORTS_FILES=exports/*.js
DEPS_JS_FILES=node_modules/@toit/esptool.js/build/*.js\
node_modules/crypto-js/core.js\
node_modules/crypto-js/enc-base64.js\
node_modules/crypto-js/md5.js
$(DIST_INDEX_JS): lib/index.js $(EXPORTS_FILES) $(DEPS_JS_FILES)
	mkdir -p $$(dirname $@)
	rm -f $@
	$(BIN)/browserify \
		--entry lib/index.js \
		--standalone BleskomatWebSerial \
		--transform [ babelify --presets [ @babel/preset-env ] ] \
		--outfile $@

$(DIST_INDEX_MIN_JS): $(DIST_INDEX_JS)
	$(BIN)/uglifyjs $^ -o $@

test:
	rm -rf $(PUBLIC)/test
	mkdir -p $(PUBLIC)/test
	cp -r $(TEST)/manual $(PUBLIC)/test/manual
	mkdir -p $(PUBLIC)/test/manual/js/dist
	cp $(DIST)/index*.js $(PUBLIC)/test/manual/js/dist/
