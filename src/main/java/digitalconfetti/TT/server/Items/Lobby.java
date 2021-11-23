package digitalconfetti.TT.server.Items;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;

import javax.swing.Timer;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class Lobby {	
	// Definimos las constantes de la clave
	final private String KEYSET = "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789";
	final private int KEYSIZE = 8;
	
	//Unique identification
	private String id;
	
	//Jugadores por Lobby
	private final int maxPlayers;
	
	private final int maxMsgs = 15;
	
	//Mapa encargado de guardar el estado de conexion de los players.
	private Map<String, Boolean> conectionMap;
	
	//Base de datos de mensajes
	@Autowired
	private MessageStorage mStorage;
	
	//Tasa de refresco de estado del server
	private float s = 3.0f;
	
	//Timer de refresco
	Timer timer = new Timer((int) (s * 1000), new ActionListener(){
		@Override
		public void actionPerformed(ActionEvent e) {
			for(Entry<String, Boolean> player: conectionMap.entrySet()){
				if(player.getValue()) {
					player.setValue(false);
				} else {
					systemMessage(player.getKey(),"se ha desconectado.");
					conectionMap.remove(player.getKey());
				}
			}
		}
	});
	
	
	// Genera una ID unica
	private String generate_Id()
	{
		String out = "";
		Random r = new Random();
		
		for(int i = 0; i < KEYSIZE-1; i++){
			out += KEYSET.charAt(r.nextInt(KEYSET.length()));
		}
		
		return out;
	}
	
	// Constructor
	
	public Lobby(int maxPlayer){
		// Creamos la ID única
		this.id = generate_Id();
		
		// Seteamos el maximo de jugadores por Lobby
		this.maxPlayers = maxPlayer;
		
		// Mapa de conexiones (Comprobar desconexiones)
		this.conectionMap = new HashMap<String, Boolean>();
		
		// Creamos un MessageStorage que se encargará de guardar el log del chat
		this.mStorage= new MessageStorage("MessageStorage/db_"+ this.id + ".csv");
		
		this.timer.start();
		
	}
	
	public String toString()
	{
		String out = "Lobby: " + this.id + "\n";
		out +="playerList: \n";
		for(Entry<String, Boolean> p: conectionMap.entrySet()){
			out += "\t" + p.getKey() + "\n";
		}
		out += "size: "+ this.getNumPlayers() + "/" + this.maxPlayers;
		return out;
	}

	public String getId() {
		return id;
	}
	
	public int getNumPlayers() {
		return this.conectionMap.size();
	}

	public void setId(String id) {
		this.id = id;
	}

	//Funcionalidad propia de la sala para emitir mensajes en nombre del sistema
	private void systemMessage(String player_Name,String body) {
		DateFormat formatter = new SimpleDateFormat("> dd/MM/yyy hh:mm:ss");
		Date now = new Date();
		Message m = new Message("System", formatter.format(now), player_Name + " " + body, "brown");
		mStorage.WriteMessage(m);
	}
	
	//Funcionalidad propia de la sala para dictaminar si ya hay alguien con ese nombre en la sala
	private boolean isPlayerOn(Player player){
		String name = player.getName();
		for(Entry<String, Boolean> p: conectionMap.entrySet()){
			if(p.getKey().equals(name)){
				return true;
			}
		}
		return false;
	}

	//Método encargado de añadir un jugador al lobby
	public Player addPlayer(String name){
		Player player = new Player(name);
		
		//Comprobamos si el jugador ya esta en ese lobby
		if (this.isPlayerOn(player)){
			return null;
		} 
		
		//Añadimos al jugador a la lista de jugadores conectados
		conectionMap.put(name, true);
		systemMessage(name, "se ha conectado.");
		player.setLobby(this.id);
		return player;
	}
	
	public boolean addMsg(Message msg) {
		mStorage.WriteMessage(msg);
		return true;
	}
	
	public List<Message> getMessages(String name){
		for(Entry<String, Boolean> player: conectionMap.entrySet()){
			if(player.getKey().equals(name)){
				player.setValue(true);
				return getMessages();
			}
		}
		return getMessages();
	}
	
	//Funcion que devuelve los mensajes de esa sala
	public List<Message> getMessages(){
		List<Message> aux = mStorage.ReadMessages_inverse();
		List<Message> out  = new ArrayList<Message>();
		int n = 0;
		aux.forEach((msg)->{
			out.add(msg);
		});
		return out;
	}
}
