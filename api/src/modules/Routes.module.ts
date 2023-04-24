import type { Express } from 'express';
import express from 'express';
import { Routes } from '../routes';
import cors from 'cors';

export class RoutesModule {
    private routes = new Routes();

    constructor(app: Express) {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.use(cors());
        app.use(this.routes.router);
    }
}
