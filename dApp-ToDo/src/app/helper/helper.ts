export enum loginMessage{unknownUser="Der Nutzer ist nicht bekannt", 
wrongPassword="Username oder Password stimmen nicht", 
userSameName="Username schon vorhanden", 
success="", 
timeout="Zeitüberschreitung der Anfrage", 
shortPassword="Password zu kurz"}

export interface loginInterface {err: string}