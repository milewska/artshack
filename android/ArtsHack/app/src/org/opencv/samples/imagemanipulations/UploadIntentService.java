package org.opencv.samples.imagemanipulations;

import java.io.BufferedInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

import org.apache.http.util.ByteArrayBuffer;

import com.google.gson.JsonObject;


import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

public class UploadIntentService extends IntentService{
	String userFriendlyErrorMessage;
	boolean D = true;
	public UploadIntentService(){
		super("Uploadintent");
	}
	
	protected void onHandleIntent(Intent intent) {
		URL url;
	    HttpURLConnection urlConnection;
	    try {
	      url = new URL("https://ql-hackfest-bti.herokuapp.com/frame");
	      urlConnection = (HttpURLConnection) url.openConnection();
	      urlConnection.setRequestMethod("POST");
	      urlConnection.setRequestProperty("Content-Type", "application/json");
	      urlConnection.setDoInput(true);
	      urlConnection.setDoOutput(true);
	      urlConnection.connect();
	    } catch (MalformedURLException e) {
	      e.printStackTrace();
	      this.userFriendlyErrorMessage = "Problem determining which server to contact, please report this error.";
	      return ;
	    } catch (ProtocolException e) {
	      this.userFriendlyErrorMessage = "Problem using POST, please report this error.";
	      e.printStackTrace();
	      return ;
	    } catch (IOException e) {
	      this.userFriendlyErrorMessage = "Problem opening connection to server, please report this error.";
	      e.printStackTrace();
	      return ;
	    }
	    JsonObject jsonParam = new JsonObject();
//	    jsonParam.addProperty("contours", new ArrayList<String>());
	    DataOutputStream printout;
	    try {
	      printout = new DataOutputStream(urlConnection.getOutputStream());
	      String jsonString = intent.getStringExtra("contours");
	      Log.d("Upload", jsonString);
//	      printout.write("{\"contours\": []}".getBytes());
	      printout.write(jsonString.getBytes());
	      printout.flush();
	      printout.close();
	    } catch (IOException e) {
	      e.printStackTrace();
	      this.userFriendlyErrorMessage = "Problem writing to the server connection.";
	      return ;
	    }
	    String JSONResponse = this.processResponse(url, urlConnection);
	    Log.d("Uplaod", JSONResponse);
	}	
	

	  public String processResponse(URL url, HttpURLConnection urlConnection) {
	    if (!url.getHost().equals(urlConnection.getURL().getHost())) {
	      Log.d("Upload", "We were redirected! Kick the user out to the browser to sign on?");
	    }
	    /* Open the input or error stream */
	    int status;
	    try {
	      status = urlConnection.getResponseCode();
	    } catch (IOException e) {
	      e.printStackTrace();
	      this.userFriendlyErrorMessage = "Problem getting server resonse code.";
	      return null;
	    }
	    if (D) {
	      Log.d("Upload", "Server status code " + status);
	    }
	    BufferedInputStream reader;
	    try {
	      if (status < 400 && urlConnection.getInputStream() != null) {
	        reader = new BufferedInputStream(urlConnection.getInputStream());
	      } else {
	        this.userFriendlyErrorMessage = "Server replied " + status;
	        reader = new BufferedInputStream(urlConnection.getErrorStream());
	      }

	      ByteArrayBuffer baf = new ByteArrayBuffer(50);
	      int read = 0;
	      int bufSize = 512;
	      byte[] buffer = new byte[bufSize];
	      while (true) {
	        read = reader.read(buffer);
	        if (read == -1) {
	          break;
	        }
	        baf.append(buffer, 0, read);
	      }
	      String JSONResponse = new String(baf.toByteArray());
	      Log.d("Upload", url + ":::" + JSONResponse);
	      return JSONResponse;
	    } catch (IOException e) {
	      e.printStackTrace();
	      this.userFriendlyErrorMessage = "Problem writing to the server connection.";
	      return null;
	    }
	  }

}
