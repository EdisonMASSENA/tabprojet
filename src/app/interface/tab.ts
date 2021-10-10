
export interface Tab {
    id:Number;
    chef:String;
    direction:String;
    priorite:String;
    projet:any;
    date:any;
    type:any;
    accompli:String;
    attention:String;
    encours:String;
    etat: String;
    tendance: String; 
    progress: Number;
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
    projetId:Number;
};
