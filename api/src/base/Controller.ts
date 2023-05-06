import { getDependencys, IDependencys } from '../libs/DependencysManager';

export abstract class ControllerBase {
    protected dd: IDependencys = getDependencys();
}
