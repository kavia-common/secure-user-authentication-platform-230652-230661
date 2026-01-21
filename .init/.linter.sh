#!/bin/bash
cd /home/kavia/workspace/code-generation/secure-user-authentication-platform-230652-230661/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

