import { defineFunction } from '@aws-amplify/backend';

export const helloWorld = defineFunction({
    runtime: 20,
    name: 'hello-world',
    entry: './handler.ts',
})