package digitalconfetti.TT.server;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import digitalconfetti.TT.server.Items.Message;
import digitalconfetti.TT.server.Items.Player;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping(value = "/get/")
public class MessageController {

	@Autowired
	ComunicationService conmutron;
	
	//POST->Player
	@PostMapping()
	public Player postPlayer(@RequestBody String player)
	{
		Player out = conmutron.addPlayer(player);
		return out;
	}
	
	//POST->Mensajes
	@PostMapping("{lobby}")
	public ResponseEntity<Boolean> postMessage(@RequestBody Message message, @PathVariable("lobby") String lobby){
		boolean out  = conmutron.addMessage(message, lobby);
		return new ResponseEntity<Boolean>(true, HttpStatus.CREATED);
	}
	
	//GET->Mensajes
	@GetMapping("{lobby}/{name}")
	public List<Message> getMessages(@PathVariable("lobby") String lobby, @PathVariable("name") String name){
		List<Message> out = this.conmutron.getMessages(lobby, name);
		return out;
	}
	
}
