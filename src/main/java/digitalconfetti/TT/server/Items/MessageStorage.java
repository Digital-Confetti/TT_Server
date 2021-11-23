package digitalconfetti.TT.server.Items;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

public class MessageStorage {
	
	private String path;
	
	
	private String separator = ";";
	
	public MessageStorage(String path){
		this.path = path;
	}
	
	public List<Message> ReadMessages(){
		try {
			List<Message> out = new ArrayList<Message>();
			String aux;
			BufferedReader reader = new BufferedReader(new FileReader(this.path));
			String[] chop = null;
			
			while ((aux = reader.readLine()) != null){
				chop = aux.split(separator); 
				out.add(new Message(chop[0],chop[1],chop[2],chop[3]));
				
			}
			return out;
		} catch (IOException e){
			System.out.println(e);
		}
		return null;
	}
	public List<Message> ReadMessages_inverse(){
		try {
			List<Message> out = new ArrayList<Message>();
			String aux;
			BufferedReader reader = new BufferedReader(new FileReader(this.path));
			String[] chop = null;
			
			while ((aux = reader.readLine()) != null){
				chop = aux.split(separator); 
				out.add(0, new Message(chop[0],chop[1],chop[2],chop[3]));
			}
			return out;
		} catch (IOException e){
			System.out.println(e);
		}
		return null;
	}
	
	public void WriteMessage(Message m){
		try {
			BufferedWriter file = new BufferedWriter(new FileWriter(this.path, true));
			file.write(m.toCsv(separator));
			file.close();
		} catch (IOException e){
			System.out.println(e);
		}
	}
}
