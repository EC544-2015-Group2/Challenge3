package com.example.liuye.challenge3;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

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
            final Button togglePIN = (Button) findViewById(R.id.toggle_pin);
            //togglePIN.setVisibility(View.INVISIBLE);

            final TextView txtPIN = (TextView) findViewById(R.id.pin);
            txtPIN.setVisibility(View.INVISIBLE);

            final Spinner pinSpinner = (Spinner) findViewById(R.id.pin_Id);
            pinSpinner.setVisibility(View.INVISIBLE);

            final RadioGroup statusGroup = (RadioGroup) findViewById(R.id.radio_status);
            statusGroup.setVisibility(View.INVISIBLE);

            final HttpRequest httpRequest = new HttpRequest();
            //String s = httpRequest.sendGet("ec544group2.ddns.net" + PORT, "device");
            JSONObject jsonObject = httpRequest.sendGet("ec544group2.ddns.net" + PORT, "device");

            JSONArray jsonArray = jsonObject.getJSONArray("deviceID");
            ArrayList<String> devices = getList(jsonArray);
            final Spinner deviceSpinner = (Spinner) findViewById(R.id.device_Id);
            deviceSpinner.setVisibility(View.INVISIBLE);

            ArrayAdapter<String> deviceArrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, devices);
            deviceArrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

            deviceSpinner.setAdapter(deviceArrayAdapter);

            deviceSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                    try {
                        txtPIN.setVisibility(View.VISIBLE);
                        pinSpinner.setVisibility(View.VISIBLE);
                        togglePIN.setVisibility(View.VISIBLE);
                        statusGroup.setVisibility(View.VISIBLE);

                        final String deviceId = (String) deviceSpinner.getSelectedItem();
                        JSONObject pinJSONObject = httpRequest.sendGet("ec544group2.ddns.net" + PORT, "device" + deviceId);

                        JSONArray pinJSONArray = pinJSONObject.getJSONArray("PINId");
                        ArrayList<String> pins = getList(pinJSONArray);


                        ArrayAdapter<String> pinArrayAdapter = getAdapter(pins);
                        pinArrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

                        pinSpinner.setAdapter(pinArrayAdapter);

                        togglePIN.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                String pinId = (String) pinSpinner.getSelectedItem();

                                RadioButton radioLow = (RadioButton) findViewById(R.id.radio_low);
                                RadioButton radioHigh = (RadioButton) findViewById(R.id.radio_high);

                                String status = "";
                                if(radioLow.isChecked())
                                    status = "LOW";
                                if(radioHigh.isChecked())
                                    status = "HIGH";

                                httpRequest.sendPost("ec544group2.ddns.net" + PORT, "device?" + deviceId + "/pin/" + pinId + "/status/" + status);
                            }
                        });

                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }

                }

                @Override
                public void onNothingSelected(AdapterView<?> parent) {

                }
            });

        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private ArrayList<String> getList(JSONArray jsonArray) {
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

    private ArrayAdapter<String> getAdapter(ArrayList<String> arrayList) {
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, arrayList);
        return adapter;
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
