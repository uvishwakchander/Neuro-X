.PHONY: build test demo

build:
	python -m compileall src

test:
	PYTHONPATH=src python -m unittest discover -s tests -v

demo:
	PYTHONPATH=src python -m neurox.demo
