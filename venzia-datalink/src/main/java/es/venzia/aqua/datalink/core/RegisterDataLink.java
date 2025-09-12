package es.venzia.aqua.datalink.core;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.everit.json.schema.ValidationException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class RegisterDataLink {
	private static Log logger = LogFactory.getLog(RegisterDataLink.class);

	private SchemaLoader schemaLoader;

	@Value("classpath:alfresco/extension/datalink/datalink-*.json")
	Resource[] resources;

	private JSONArray dataLinks;

	public void init() throws IOException {

		dataLinks = new JSONArray();

		for (Resource resource : resources) {
			try {
				String jsonData = IOUtils.toString(resource.getInputStream(), StandardCharsets.UTF_8.name());
				JSONObject datalinkEntry = new JSONObject(jsonData);
				schemaLoader.getSchema().validate(datalinkEntry);
				dataLinks.put(datalinkEntry);
				logger.info("Datalink " + datalinkEntry.getString("name") + "added");
			} catch (ValidationException ex) {
				logger.error(ex);
			}
		}

	}

	public SchemaLoader getSchemaLoader() {
		return schemaLoader;
	}

	public void setSchemaLoader(SchemaLoader schemaLoader) {
		this.schemaLoader = schemaLoader;
	}

	public JSONArray getDataLinks() {
		return dataLinks;
	}


}
