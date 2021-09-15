
export interface Tab {
    id:Number;
    chef:String;
    direction:String;
    priorite:String;
    projet:String;
    mois:any;
    annee:any;
    date:any;
    type:String;
    accompli:String;
    attention:String;
    encours:String;
    etat: String;
    tendance: String; 
    editing: Boolean;
};

export interface User{
    id:Number;
    direction:String;
    mdp:String;
    
};

export interface Upload{
    id:Number;
    data:Blob;
    type:String;
    
};
