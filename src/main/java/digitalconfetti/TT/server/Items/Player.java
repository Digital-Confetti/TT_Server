package digitalconfetti.TT.server.Items;

public class Player {
	
	//Nombre del jugador
	private String name;
		
	private String lobby;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getLobby() {
		return lobby;
	}
	public void setLobby(String lobby) {
		this.lobby = lobby;
	}
	
	public Player(String name) {
		this.setName(name);
		this.setLobby("");
	}
}
