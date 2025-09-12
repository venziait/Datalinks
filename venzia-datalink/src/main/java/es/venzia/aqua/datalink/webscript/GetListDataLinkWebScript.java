/**
 * Copyright (C) 2017 Alfresco Software Limited.
 * <p/>
 * This file is part of the Alfresco SDK project.
 * <p/>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package es.venzia.aqua.datalink.webscript;

import es.venzia.aqua.datalink.core.RegisterDataLink;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.AbstractWebScript;
import org.springframework.extensions.webscripts.Format;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;

import java.io.IOException;

/**
 * Return a datalink list
 *
 * @author hcastillo.mendoza@venzia.es
 * @since 1.0
 */
public class GetListDataLinkWebScript extends AbstractWebScript { 

    private static Log logger = LogFactory.getLog(GetListDataLinkWebScript.class);
    
    private RegisterDataLink registerDataLink;
   

	public void setRegisterDataLink(RegisterDataLink registerDataLink) {
		this.registerDataLink = registerDataLink;
	}

	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {
		res.setContentType(Format.JSON.mimetype());
		res.getWriter().write( registerDataLink.getDataLinks().toString());
		res.getWriter().flush();
		if(logger.isDebugEnabled()) {
			logger.debug("JSON DataLink");
			logger.debug(registerDataLink.getDataLinks().toString());
		}
	}

    
    
}