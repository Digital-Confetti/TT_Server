 package digitalconfetti.TT.server;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import digitalconfetti.TT.server.Items.Lobby;
import digitalconfetti.TT.server.Items.Message;
import digitalconfetti.TT.server.Items.Player;

@Service
public class ComunicationService {

	private List<Lobby> lobbyList = new ArrayList<Lobby>();
	
	private Lobby active;
	
	private final int lobbySize = 4;
	
	public ComunicationService() {
		//Nada mas crear el Objeto creamos el primer lobby
		this.active = new Lobby(lobbySize);
		//Añadimos el lobby a la lsta de lobbys
		this.lobbyList.add(0, this.active);
	}
	
	public void checkActivelLobby()
	{
		lobbyList.forEach((lobby) -> {
			if (lobby.getNumPlayers() < this.lobbySize) {
				this.active = lobby;
				return;
			}
		});
		
		
	}
	
	//Funcionalidad asociada a añadir un jugador al lobby activo
	public Player addPlayer(String name) {
		
		if(this.active.getNumPlayers() < this.lobbySize)
		{
			Player aux = this.active.addPlayer(name);
			System.out.println(this.active.toString());
			return aux;
		} 
		return null;
	}
	
	//getMessages()
	public List<Message> getMessages(String lobby, String name)
	{
		List<Message> out = new ArrayList<Message>();
		lobbyList.forEach((l)->{
			if(l.getId().equals(lobby)){
				out.addAll(l.getMessages(name));
			}
		});
		System.out.println(this.active.toString());
		return out;
	}
	
	public boolean addMessage(Message m, String l) {
		
		lobbyList.forEach((item)->{
			if(item.getId().equals(l)){
				item.addMsg(m);
			}
		});
		System.out.println(this.active.toString());
		return true;
	}

}
