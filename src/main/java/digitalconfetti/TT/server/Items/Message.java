package digitalconfetti.TT.server.Items;

public class Message {
	
	//fecha en la que ha sido emitido el mensaje
	private String date;
	
	//cadena en la que guardaremos el texto del mensaje
	private String text;
	
	//usuario emisor del mensaje
	private String user;
	
	//color de mensaje
	private String color;
	
	public Message(String user, String date, String text, String color){
		this.setDate(date);
		this.setText(text);
		this.setUser(user);
		this.setColor(color);
	}
	
	public String toCsv(String separator){
		String out = this.user + separator + this.date + separator + this.text + separator + this.color + '\n';
		return out;
	}
	
	//getters and setters
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}
	
	public String getColor(){
		return color;
	}
	
	public void setColor(String color)
	{
		this.color = color;
	}

}
