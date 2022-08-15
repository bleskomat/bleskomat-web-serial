## Usage
#
#   $ make all        # compile files that need compiling
#   $ make clean all  # remove target files and compile from scratch
#

## Variables
BIN=./node_modules/.bin
BUILD=./build
DIST=./dist
EXPORTS=./exports
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
.PHONY: build\
clean\
partitionData\
test

build: partitionData\
$(DIST)/index.js\
$(DIST)/index.min.js

clean:
	# Delete build process output files:
	rm -rf $(BUILD)
	rm -rf $(DIST)
	rm -f $(EXPORTS)/partitionData/index.js

EXPORTS_FILES=$(EXPORTS)/*.js
DEPS_JS_FILES=node_modules/@toit/esptool.js/build/*.js\
node_modules/crypto-js/core.js\
node_modules/crypto-js/enc-base64.js\
node_modules/crypto-js/md5.js
$(BUILD)/index.js: lib/index.js $(EXPORTS_FILES) $(DEPS_JS_FILES)
	mkdir -p $(BUILD)
	mkdir -p $$(dirname $@)
	rm -f $@
	$(BIN)/browserify \
		--entry lib/index.js \
		--standalone BleskomatWebSerial \
		--transform [ babelify --presets [ @babel/preset-env ] ] \
		--outfile $@

$(BUILD)/index.min.js: $(BUILD)/index.js
	$(BIN)/uglifyjs $^ -o $@

$(BUILD)/COPYRIGHT.js: COPYRIGHT
	mkdir -p $(BUILD)
	echo "/*" > $@
	cat $^ | sed -e 's/^/ *  /' >> $@
	echo "" >> $@
	echo " *" >> $@
	echo " */" >> $@

$(DIST)/index.js: $(BUILD)/COPYRIGHT.js $(BUILD)/index.js
	mkdir -p $(DIST)
	rm -rf $@
	for input in $^; do cat $$input >> $@; done

$(DIST)/index.min.js: $(BUILD)/COPYRIGHT.js $(BUILD)/index.min.js
	mkdir -p $(DIST)
	rm -rf $@
	for input in $^; do cat $$input >> $@; done

$(EXPORTS)/partitionData/index.js: $(EXPORTS)/partitionData/bootloader.bin\
$(EXPORTS)/partitionData/otaSlot.bin\
$(EXPORTS)/partitionData/partitionsTable.bin
	node -e "\
		const fs = require('fs');\
		const partitionDataJson = JSON.stringify({\
			bootloader: fs.readFileSync('exports/partitionData/bootloader.bin', 'base64'),\
			otaSlot: fs.readFileSync('exports/partitionData/otaSlot.bin', 'base64'),\
			partitionsTable: fs.readFileSync('exports/partitionData/partitionsTable.bin', 'base64'),\
		}, null, 2).replace(/ {2,}/g, '\t');\
		fs.writeFileSync('exports/partitionData/index.js', 'module.exports = ' + partitionDataJson + ';\n');\
	"

partitionData: $(EXPORTS)/partitionData/index.js

test: build
	rm -rf $(PUBLIC)/test
	mkdir -p $(PUBLIC)/test
	cp -r $(TEST)/manual $(PUBLIC)/test/manual
	mkdir -p $(PUBLIC)/test/manual/js/dist
	cp $(DIST)/index*.js $(PUBLIC)/test/manual/js/dist/
