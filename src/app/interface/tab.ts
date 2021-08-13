
export interface Tab {
    id:number;
    chef:string;
    direction:string;
    priorite:string;
    projet:string;
    mois:any;
    annee:any;
    date:any;
    type:string;
    accompli:string;
    attention:string;
    encours:string;
    etat: string;
    tendance: string; 
    editing: boolean;
};

export interface User{
    id:number;
    direction:string;
    mdp:string;
    
};

