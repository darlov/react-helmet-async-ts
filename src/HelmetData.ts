import {
  IHelmetDataContext,
  IHelmetInstanceState,
  IHelmetState, TagPriorityConfig,
  ModifyInstanceCallback, DefaultTagPriorityConfig, ITagPriorityConfigMap, TagConfigName
} from "./types";
import {_, buildServerState, buildState, removeItem} from "./utils";


const buildPriorityMap = (priorityConfig: TagPriorityConfig[]) => {
  const map = new Map<TagConfigName, ITagPriorityConfigMap[]>();
  for (let i = 0; i < priorityConfig.length; i++) {
    const config = priorityConfig[i];
    const values = map.get(config.tagName);
    if (values != undefined) {
      values.push({priority: i, config: config})
    } else {
      map.set(config.tagName, [{priority: i, config: config}]);
    }
  }
  return map;
}

const defaultMap = buildPriorityMap(DefaultTagPriorityConfig);

export class HelmetData {
  private _instances = new Map<number, IHelmetInstanceState>();
  private _helmetState: IHelmetState = {tags: [], isEmptyState: false};
  private readonly _priority: Map<TagConfigName, ITagPriorityConfigMap[]>;
  private _stateUpdated = true;

  constructor(priority: TagPriorityConfig[] | undefined, private _context?: IHelmetDataContext, private _canUseDOM = typeof document !== 'undefined') {
    if (priority !== undefined) {
      this._priority = buildPriorityMap(priority);
    } else {
      this._priority = defaultMap;
    }
  }

  get helmetState() {
    this.buildState();
    return this._helmetState;
  }

  get canUseDOM() {
    return this._canUseDOM;
  }

  addInstance = (instance: IHelmetInstanceState) => {
    this._instances.set(instance.id, instance);
    this._stateUpdated = true;
  }

  removeInstance = (instance: IHelmetInstanceState) => {
    this._instances.delete(instance.id);
    this._stateUpdated = true;
  }

  addItem: ModifyInstanceCallback = (instance, value) => {
    if (instance.tags === undefined) {
      instance.tags = [value]
    } else {
      instance.tags.push(value);
    }

    this._stateUpdated = true;
  }

  removeItem: ModifyInstanceCallback = (instance, value) => {
    if(instance.tags !== undefined){
      const foundIndex = instance.tags.indexOf(value);
      if(foundIndex >= 0) {
        instance.tags.splice(foundIndex, 1);
      }
    }
    this._stateUpdated = true;
  }

  private buildState = () => {
    if (this._stateUpdated) {
      const orderedInstances = _.sortBy([...this._instances.values()], "id");
      this._helmetState = buildState(orderedInstances, this._priority);

      if (!this._canUseDOM && this._context) {
        this._context.state = buildServerState(this._helmetState)
      }

      this._stateUpdated = false;
    }
  }
}