package es.venzia.aqua.datalink.core;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.everit.json.schema.Schema;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class SchemaLoader {
	
	private static Log logger = LogFactory.getLog(SchemaLoader.class);
	 
	@Autowired
	private ResourceLoader resourceLoader;
	
	private String schemaFile;
	
	private Schema schema = null;
	
	public void init() throws JSONException, IOException {
		
		Resource resource = resourceLoader.getResource(schemaFile);
		String body = IOUtils.toString(resource.getInputStream(), StandardCharsets.UTF_8.name()); 
		
		
		JSONObject jsonSchema = new JSONObject(new JSONTokener(body));
		
		
		
		org.everit.json.schema.loader.SchemaLoader loader = org.everit.json.schema.loader.SchemaLoader.builder()
	            .schemaJson(jsonSchema)
	            .draftV7Support()
	            .build();
		
		this.schema = loader.load().build();
		
		logger.info("Datalink Schema  has been  registered");
		
	}

	public String getSchemaFile() {
		return schemaFile;
	}

	public void setSchemaFile(String schemaFile) {
		this.schemaFile = schemaFile;
	}

	public Schema getSchema() {
		return schema;
	}

	public void setSchema(Schema schema) {
		this.schema = schema;
	}

	
	
}
