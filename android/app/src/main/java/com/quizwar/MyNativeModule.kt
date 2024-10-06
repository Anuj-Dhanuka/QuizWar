package com.quizwar

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class MyNativeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MyNativeModule"
    }

    @ReactMethod
    fun sayHello(name: String, promise: Promise) {
        try {
            val greeting = "Hello, $name!"
            promise.resolve(greeting)
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }
}
