import { defineBackend } from '@aws-amplify/backend';
import { helloWorld } from './function/hello-world/resource';

const backend = defineBackend({
    helloWorld,
})

backend.addOutput({
    custom: {
        helloWorldFuctionName: backend. helloWorld. resources. lambda. functionName
    },
});