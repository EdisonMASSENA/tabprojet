
export interface Tab {
    id:number;
    chef:string;
    direction:string;
    priorite:string;
    projet:string;
    accompli:string;
    attention:string;
    enCours:string;
    etat: string;
    tendance: string; 
    editing: boolean;
}

export interface User{
    id:number;
    direction:string;
    mdp:string;
    
}

export interface Dir {
    value: string;
  }
  