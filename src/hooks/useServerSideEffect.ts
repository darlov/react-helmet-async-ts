import {DependencyList, EffectCallback, useEffect} from "react";

export type ServerSideCondition = () => boolean;

export const useServerSideEffect = (effect: EffectCallback, condition: ServerSideCondition, deps?: DependencyList) => {
  useEffect(effect, deps);
  
  if(condition()){
    effect();
  }
}