package com.ecoruta.recyclingapp

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Puente con el lado nativo para recibir el residuo que envía App 2
 * (Logística) mediante la acción `com.ecoruta.recycling.ACTION_RECIBIR_RESIDUO_PROCESADO`.
 *
 * El lado JS consulta [getInitialResiduo] al montar la app y cada vez que
 * vuelve a foreground (ver hook useIncomingResiduos), y llama a
 * [clearResiduoExtra] tras procesarlo para no volver a leer el mismo valor.
 */
class IntentModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "IntentModule"

    @ReactMethod
    fun getInitialResiduo(promise: Promise) {
        val json = reactApplicationContext.currentActivity?.intent?.getStringExtra(EXTRA_RESIDUO_JSON)
        promise.resolve(json)
    }

    @ReactMethod
    fun clearResiduoExtra() {
        reactApplicationContext.currentActivity?.intent?.removeExtra(EXTRA_RESIDUO_JSON)
    }

    companion object {
        const val EXTRA_RESIDUO_JSON = "residuo_json"
    }
}
