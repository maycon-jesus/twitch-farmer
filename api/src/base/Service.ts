import { getDependencys, IDependencys } from '../libs/DependencysManager';

export abstract class ServiceBase {
    dd: IDependencys = getDependencys()
}