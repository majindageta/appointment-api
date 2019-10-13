appointment-api


TODO E NOTE
L'attuale implementazione del db è: 
DB
vendorID_DAY     user_UIDEVENT

quando l'utente singolo entra nell'app recuperiamo telefono e device token
o ci facciamo passare questi dati in una sorta di login e poi restituiamo all'utente un hash di queste info
o lo deve fare il client

dopo di che ogni chiamata avrà il token user nella firma (header, query) oltre a questo bisogna avere altre info
il vendorId sarà schiantato nell'app inizialmente

per cercare eventi per un giorno specifico un utente normale cerca per vendor_day e passando come SK il token
per creare e modificare stessa cosa + un id evento o autogenerato o passato dal client

COME GESTIRE ADMIN MODE? il token se lo prende dall'evento e lo passa? le chiamate che manda l'admin avranno anche un API KEY?