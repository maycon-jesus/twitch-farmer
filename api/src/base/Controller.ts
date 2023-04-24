import { IDependencys, getDependencys } from "../libs/DependencysManager";

export abstract class ControllerBase {
  protected dd: IDependencys = getDependencys();
}
