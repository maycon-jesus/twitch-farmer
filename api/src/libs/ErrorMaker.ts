export type ErrorTypes =
    | 'form_validation'
    | 'database'
    | 'forbidden'
    | 'unprocessable_entity'
    | 'unauthorized'
    | 'other'
    | 'unknown'
    | 'not_found';

interface optsBase {
    type: ErrorTypes;
    errors: unknown[];
    filePath?: string;
}

interface optsOther extends optsBase {
    type: Exclude<ErrorTypes, 'form_validation'>;
    errors: { message: string }[];
}

interface optsFormValidation extends optsBase {
    type: 'form_validation';
    errors: {
        key: string;
        message: string;
    }[];
}

type opts = optsOther | optsFormValidation;

export class ErrorMaker extends Error {
    type: optsBase['type'];
    errors: optsBase['errors'];
    filePath: optsBase['filePath'];

    constructor(opts: opts) {
        super(`Erro ${opts.type}`);

        this.type = opts.type;
        this.errors = opts.errors;
        if (opts.filePath) this.filePath = opts.filePath;
    }
}

export function ErrorToResponse(error: ErrorMaker | Error): {
    status: number;
    error: ErrorMaker;
} {
    if (error instanceof ErrorMaker) {
        const errorsMap: Record<
            ErrorTypes,
            {
                status: number;
            }
        > = {
            database: {
                status: 500,
            },
            form_validation: {
                status: 400,
            },
            other: {
                status: 500,
            },
            unknown: {
                status: 500,
            },
            unprocessable_entity: {
                status: 422,
            },
            forbidden: {
                status: 403,
            },
            unauthorized: {
                status: 401,
            },
            not_found: {
                status: 404,
            },
        };

        const errorMapped = errorsMap[error.type];
        return {
            status: errorMapped.status,
            error: error,
        };
    } else {
        return {
            status: 500,
            error: new ErrorMaker({
                type: 'unknown',
                errors: [{ message: 'Ocorreu um erro interno!' }],
            }),
        };
    }
}
