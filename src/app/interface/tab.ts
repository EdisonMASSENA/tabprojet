
export interface Tab {
    id:Number;
    chef:String;
    direction:String;
    priorite:String;
    projet:any;
    debut:any;
    fin:any;
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
    username:String;
    password:String;
};

export interface Upload{
    id:Number;
    data:Blob;
    type:String;
    tab_id:Number;
};
