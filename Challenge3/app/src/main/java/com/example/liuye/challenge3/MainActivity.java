package com.example.liuye.challenge3;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    final int PORT = 7654;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });


        try {
            HttpRequest httpRequest = new HttpRequest();
            //String s = httpRequest.sendGet("ec544group2.ddns.net" + PORT, "device");
            JSONObject jsonObject = httpRequest.sendGet("ec544group2.ddns.net" + PORT, "device");

            JSONArray jsonArray = jsonObject.getJSONArray("deviceID");
            ArrayList<String> devices = getDeviceList(jsonArray);
            Spinner spinner = (Spinner) findViewById(R.id.device_Id);

            ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, devices);
            arrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

            spinner.setAdapter(arrayAdapter);
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private ArrayList<String> getDeviceList(JSONArray jsonArray) {
        ArrayList<String> list = new ArrayList<String>();

        try{
            for(int i = 0; i<jsonArray.length(); i++) {
                list.add(jsonArray.get(i).toString());
            }
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
        return list;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
