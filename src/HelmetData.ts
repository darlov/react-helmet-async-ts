import {
  IHelmetDataContext,
  IHelmetInstanceState,
  IHelmetState,
  UpdateInstanceCallback
} from "./types";
import {_, addUniqueItem, buildServerState, buildState, removeItem} from "./utils";

export class HelmetData {
  private _instances: IHelmetInstanceState[] = [];
  private _helmetState?: IHelmetState;

  constructor(private _context?: IHelmetDataContext, private _canUseDOM = typeof document !== 'undefined') {
    this.buildState();
  }

  get helmetState() {
    return this._helmetState;
  }

  get canUseDOM() {
    return this._canUseDOM;
  }

  addInstance = (instance: IHelmetInstanceState) => {
    this._instances = addUniqueItem(this._instances, instance, m => m.id);
    this.buildState();
  }

  removeInstance = (instance: IHelmetInstanceState) => {
    this._instances = removeItem(this._instances, instance, m => m.id);
    this.buildState();
  }

  addItem: UpdateInstanceCallback = (instance, propName, value) => {
    instance[propName] = addUniqueItem(instance[propName] as any[], value)
    this.buildState();
  }

  removeItem: UpdateInstanceCallback = (instance, propName, value) => {
    instance[propName] = removeItem(instance[propName] as any[], value)
    this.buildState();
  }

  private buildState = () => {
    const orderedInstances = _.sortBy(this._instances, "id");
    this._helmetState = buildState(orderedInstances);

    if (!this._canUseDOM && this._context) {
      this._context.state = buildServerState(this._helmetState)
    }
  }
}