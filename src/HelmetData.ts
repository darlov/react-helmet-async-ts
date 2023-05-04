import {IHelmetInstanceState, IHelmetServerState, IHelmetState} from "./types";
import {_, addUniqueItem, buildServerState, buildState, removeItem} from "./utils";

export class HelmetData {
  private _instances: IHelmetInstanceState[] = [];
  private _state?: IHelmetServerState;
  private _helmetState?: IHelmetState;

  constructor(private _canUseDOM = typeof document !== 'undefined') {
  }
  
  get state (){
    return this._state;
  }

  get helmetState (){
    return this._helmetState;
  }

  get canUseDOM () {
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

 updateInstance = <T extends keyof Omit<IHelmetInstanceState, "id" | "emptyState">>(instance: IHelmetInstanceState, propName: T, values: IHelmetInstanceState[T]  ) => {
  instance[propName] = values
 }
  
  private buildState = () => {
    const orderedInstances = _.sortBy(this._instances, "id");
    this._helmetState = buildState(orderedInstances);
    
    if(!this._canUseDOM){
      this._state = buildServerState(this._helmetState)
    }
  }
}