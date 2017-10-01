# #!/usr/bin/python3
# import sys
# import logging
# logging.basicConfig(stream=sys.stderr)
# sys.path.insert(0,"/home/cameron/stock_loan")
#
# # import newrelic.agent
# # newrelic.agent.initialize('~/newrelic/newrelic.ini')

from stock_loan import create_app
app = create_app()


if __name__ == "__main__":
    app.run()